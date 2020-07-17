FROM python:3.6
COPY . /app
WORKDIR /app
RUN pip install -r conf/pip_reqs.txt
CMD ["python", "main.py"]